import { BaseShape } from "./BaseShape";
import { ShapeUtils } from "./ShapeUtils";
import { BoundingBox, Rand, Vector3 } from "@galacean/engine-math";
import { ParticleShapeType } from "../../enum/ParticleShapeType";

/**
 * Box emitter shape
 */
export class BoxShape extends BaseShape {
  /** Thickness of the box to emit particles from. */
  boxThickness: Vector3 = new Vector3(1, 1, 1);

  constructor() {
    super();
    this.shapeType = ParticleShapeType.Box;
  }

  /**
   * @inheritDoc
   */
  protected override _getShapeBoundBox(boundBox: BoundingBox): void {
    Vector3.scale(this.boxThickness, -0.5, boundBox.min);
    Vector3.scale(this.boxThickness, 0.5, boundBox.max);
  }

  /**
   * @inheritDoc
   */
  protected override _getSpeedBoundBox(boundBox: BoundingBox): void {
    const min: Vector3 = boundBox.min;
    min.x = 0.0;
    min.y = 0.0;
    min.z = 0.0;
    const max: Vector3 = boundBox.max;
    max.x = 0.0;
    max.y = 1.0;
    max.z = 0.0;
  }

  /**
   * @internal
   */
  override _generatePositionAndDirection(
    position: Vector3,
    direction: Vector3,
    rand: Rand = null,
    randomSeeds: Uint32Array = null
  ): void {
    if (rand) {
      rand.seed = randomSeeds[16];
      ShapeUtils._randomPointInsideHalfUnitBox(position, rand);
      randomSeeds[16] = rand.seed;
    } else {
      ShapeUtils._randomPointInsideHalfUnitBox(position);
    }
    position.multiply(this.boxThickness);
    if (this.randomDirectionAmount) {
      if (rand) {
        rand.seed = randomSeeds[17];
        ShapeUtils._randomPointUnitSphere(direction, rand);
        randomSeeds[17] = rand.seed;
      } else {
        ShapeUtils._randomPointUnitSphere(direction);
      }
    } else {
      direction.x = 0.0;
      direction.y = 0.0;
      direction.z = 1.0;
    }
    // reverse to default direction
    direction.z *= -1.0;
  }

  override cloneTo(destShape: BoxShape): void {
    super.cloneTo(destShape);
    destShape.boxThickness.copyFrom(this.boxThickness);
    destShape.randomDirectionAmount = this.randomDirectionAmount;
  }

  override clone(): BoxShape {
    const destShape = new BoxShape();
    this.cloneTo(destShape);
    return destShape;
  }
}