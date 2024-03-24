import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

const Popup = ({ map, maps, position, children }) => {
  const [container] = useState(document.createElement("div"));

  useEffect(() => {
    if (!map || !maps || !position) return;

    const overlay = new maps.OverlayView();

    overlay.onAdd = function () {
      const panes = this.getPanes();
      panes.floatPane.appendChild(container);
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      const pixelPosition = projection.fromLatLngToDivPixel(position);

      if (!pixelPosition) return;

      const style = container.style;
      style.position = "absolute";
      style.left = `${pixelPosition.x}px`;
      style.top = `${pixelPosition.y}px`;
    };

    overlay.onRemove = function () {
      if (container.parentElement) {
        container.parentElement.removeChild(container);
      }
    };

    overlay.setMap(map);

    return () => {
      overlay.setMap(null);
    };
  }, [map, maps, position, container]);

  return ReactDOM.createPortal(children, container);
};

export default Popup;
