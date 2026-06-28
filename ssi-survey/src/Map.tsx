import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { SurveyPoint } from "./SurveyCalculations";

const MAPSTART = {
  lat: 53.35717010498047,
  lng: -2.0468735694885254,
  zoom: 15,
}
type IProps = {
  title: string;
  surveyPoints: SurveyPoint[];
};
function Map({ title, surveyPoints }: IProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = L.map(mapRef.current).setView(
      [MAPSTART.lat, MAPSTART.lng],
      MAPSTART.zoom,
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstanceRef.current);

    surveyPoints.forEach((surveyPoint) => {
      let toolTipContent = ''
      if (surveyPoint.rse_track_1) {
        toolTipContent = `RSE: ${surveyPoint.rse_track_1.toFixed(4)}`
      } else if (surveyPoint.etd_track_3 && surveyPoint.etd_track_4) {
        toolTipContent = `ETD Track 3: ${surveyPoint.etd_track_3.toFixed(1)} -- ETD Track 4: ${surveyPoint.etd_track_4.toFixed(1)}`
      }
      L.marker([surveyPoint.latitude, surveyPoint.longitude])
        .addTo(mapInstanceRef.current!)
        .bindPopup(toolTipContent);
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [surveyPoints]);

  return (
    <>
      <h3 className="text-lg mt-6 mb-2">{title}</h3>
      <div ref={mapRef} className="h-96 mr-2">
        Map goes here
      </div>
    </>
  );
}

export default Map;
