import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcycleTrackingService } from 'src/app/services/motorcycle-tracking.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders-map',
  templateUrl: './orders-map.component.html',
  styleUrls: ['./orders-map.component.scss']
})
export class OrderMapComponent implements OnInit, OnDestroy {

  motorcycles: Motorcycle[] = [];
  map: any;
  marker: any;

  currentPlate: string | null = null;

  // CONTROL DE TOAST
  showToast = false;
  toastMessage = '';

  // INDICADOR DE CARGA
  isLoading = false;
  loadingMessage = 'Conectando con la moto...';

  // GUARDAR ULTIMAS COORDENADAS PARA DETECTAR MOVIMIENTO REAL
  lastLat: number | null = null;
  lastLng: number | null = null;

  // ICONO CON FONT AWESOME (más fácil y profesional)
  motoIcon = L.divIcon({
    html: `
      <div style="
        background-color: #3b82f6;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <i class="fas fa-motorcycle" style="color: white; font-size: 20px;"></i>
      </div>
    `,
    className: 'custom-moto-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  // ALTERNATIVA: Estilo más simple sin círculo
  motoIconSimple = L.divIcon({
    html: '<i class="fas fa-motorcycle" style="color: #ef4444; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);"></i>',
    className: 'moto-icon-simple',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // ALTERNATIVA: Con Material Icons
  motoIconMaterial = L.divIcon({
    html: `
      <div style="
        background-color: #10b981;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <span class="material-icons" style="color: white; font-size: 20px;">two_wheeler</span>
      </div>
    `,
    className: 'moto-material-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });

  constructor(private trackingService: MotorcycleTrackingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // NO configurar iconos por defecto de Leaflet
    // Vamos a usar nuestros iconos personalizados

    this.loadMotorcycles();
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.currentPlate) {
      this.trackingService.stopTracking(this.currentPlate).subscribe();
    }
  }

  loadMotorcycles() {
    this.trackingService.getMotorcycles().subscribe((data) => {
      this.motorcycles = data;
    });
  }

  initMap() {
    this.map = L.map('map').setView([4.65, -74.1], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // CREAR MARCADOR CON ICONO DE FONT AWESOME
    // Elige una de las tres opciones: motoIcon (círculo azul), motoIconSimple (rojo simple), o motoIconMaterial (verde)
    this.marker = L.marker([4.65, -74.1], { icon: this.motoIcon }).addTo(this.map);
  }

  onSelectMoto(event: any) {
    const plate = event.target.value;
    if (!plate) return;

    // MOSTRAR INDICADOR DE CARGA
    this.isLoading = true;
    this.loadingMessage = `Conectando con ${plate}...`;

    // Reiniciar última posición
    this.lastLat = null;
    this.lastLng = null;

    if (this.currentPlate) {
      this.trackingService.stopTracking(this.currentPlate).subscribe();
    }

    this.currentPlate = plate;

    this.trackingService.startTracking(plate).subscribe({
      next: () => {
        this.trackingService.listenToPlate(plate).subscribe((coord: any) => {

          // OCULTAR LOADING AL RECIBIR PRIMERA COORDENADA
          if (this.isLoading) {
            this.isLoading = false;
          }

          console.log("DATA RECIBIDA DEL BACKEND:");
          console.log("Placa:", plate);
          console.log("Lat:", coord.lat, "Lng:", coord.lng);
          console.log("Objeto completo:", coord);

          // SI NO SE HA MOVIDO → NO HACER NADA
          if (this.lastLat === coord.lat && this.lastLng === coord.lng) {
            return;
          }

          // SI ESTA ES LA PRIMERA VEZ DE COORDENADAS, SOLO ACTUALIZAR
          if (this.lastLat === null || this.lastLng === null) {
            this.lastLat = coord.lat;
            this.lastLng = coord.lng;
            this.updateMarker(coord.lat, coord.lng);
            return;
          }

          // SI REALMENTE SE MOVIÓ
          this.lastLat = coord.lat;
          this.lastLng = coord.lng;

          this.updateMarker(coord.lat, coord.lng);
          this.showMovementToast(plate);

        });
      },
      error: (err) => {
        this.isLoading = false;
        this.toastMessage = `Error al conectar con ${plate}`;
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        console.error('Error en startTracking:', err);
      }
    });
  }

  updateMarker(lat: number, lng: number) {
    this.marker.setLatLng([lat, lng]);
    this.map.panTo([lat, lng]);
  }

  showMovementToast(plate: string) {
    this.toastMessage = `La moto (${plate}) se movió`;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  back() {
    this.router.navigate([`/orders/list`]);
  }

}