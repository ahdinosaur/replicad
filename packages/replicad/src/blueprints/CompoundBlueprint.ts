import { Point2D, BoundingBox2d } from "../lib2d";
import Blueprint from "./Blueprint";
import { BlueprintInterface } from "./lib";

import { Face } from "../shapes";

import { Plane, PlaneName, Point } from "../geom";

import { ScaleMode } from "../curves";
import CompoundSketch from "../sketches/CompoundSketch";

export default class CompoundBlueprint implements BlueprintInterface {
  blueprints: Blueprint[];
  protected _boundingBox: BoundingBox2d | null;

  constructor(blueprints: Blueprint[]) {
    this.blueprints = blueprints;
    this._boundingBox = null;
  }

  get boundingBox(): BoundingBox2d {
    if (!this._boundingBox) {
      const box = new BoundingBox2d();
      this.blueprints.forEach((b) => box.add(b.boundingBox));
      this._boundingBox = box;
    }
    return this._boundingBox;
  }

  stretch(
    ratio: number,
    direction: Point2D,
    origin: Point2D
  ): CompoundBlueprint {
    return new CompoundBlueprint(
      this.blueprints.map((bp) => bp.stretch(ratio, direction, origin))
    );
  }

  rotate(angle: number, center: Point2D): CompoundBlueprint {
    return new CompoundBlueprint(
      this.blueprints.map((bp) => bp.rotate(angle, center))
    );
  }

  translate(xDist: number, yDist: number): CompoundBlueprint {
    return new CompoundBlueprint(
      this.blueprints.map((bp) => bp.translate(xDist, yDist))
    );
  }

  mirror(
    centerOrDirection: Point2D,
    origin: Point2D,
    mode: "center" | "plane"
  ): CompoundBlueprint {
    return new CompoundBlueprint(
      this.blueprints.map((bp) => bp.mirror(centerOrDirection, origin, mode))
    );
  }

  sketchOnPlane(plane: Plane): CompoundSketch;
  sketchOnPlane(plane?: PlaneName, origin?: Point | number): CompoundSketch;
  sketchOnPlane(
    plane?: PlaneName | Plane,
    origin?: Point | number
  ): CompoundSketch {
    const sketches = this.blueprints.map((blueprint) =>
      plane ? blueprint.sketchOnPlane() : blueprint.sketchOnPlane(plane, origin)
    );

    return new CompoundSketch(sketches);
  }

  sketchOnFace(face: Face, scaleMode: ScaleMode): CompoundSketch {
    const sketches = this.blueprints.map((blueprint) =>
      blueprint.sketchOnFace(face, scaleMode)
    );

    return new CompoundSketch(sketches);
  }
}
