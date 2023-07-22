import { $ } from "@core/dom";

export function resizeHandler($root, event) {
  const $resizer = $(event.target);
  const $parent = $resizer.closest("[data-type='resizable']");
  const coords = $parent.getCoords();
  const type = $resizer.data.resize;
  const sideProp = type === "col" ? "bottom" : "right";
  let value;

  $resizer.css({
    opacity: 1,
    [sideProp]: "-5000px",
  });

  document.onmousemove = (e) => {
    if (type === "col") {
      const delta = e.x - coords.right;
      value = coords.width + delta;
      $resizer.css({ right: -delta + "px" });
    } else {
      const delta = e.y - coords.bottom;
      value = coords.height + delta;
      $resizer.css({ bottom: -delta + "px" });
    }
  };

  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;

    if (type === "col") {
      $parent.css({ width: value + "px", right: 0 });
      $root
        .findAll(`[data-col="${$parent.data.col}"]`)
        .forEach((el) => (el.style.width = value + "px"));
      $resizer.css({ right: 0 });
    } else {
      $parent.css({ height: value + "px", bottom: 0 });
      $resizer.css({ bottom: 0 });
    }

    $resizer.css({ opacity: 0, [sideProp]: 0 });
  };
}
