import type { BikeComponent, ComponentCategory, ValidationResult } from "../types";

interface CompatibilityRule {
  id: string;
  message: string;
  validate: (selectedComponents: BikeComponent[]) => boolean;
}

const rules: CompatibilityRule[] = [
  {
    id: "disc-brake-system",
    message: "El cuadro, ruedas y frenos deben compartir el mismo tipo de freno.",
    validate: (selectedComponents: BikeComponent[]): boolean => {
      const frame = findCategory(selectedComponents, "frameset");
      const wheels = findCategory(selectedComponents, "wheels");
      const brakes = findCategory(selectedComponents, "brakes");

      if (!frame || !wheels || !brakes) return true;

      return (
        frame.standards.brake === wheels.standards.brake &&
        frame.standards.brake === brakes.standards.brake
      );
    }
  },
  {
    id: "seatpost-diameter",
    message: "La tija debe coincidir con el diametro o sistema propietario del cuadro.",
    validate: (selectedComponents: BikeComponent[]): boolean => {
      const frame = findCategory(selectedComponents, "frameset");
      const seatpost = findCategory(selectedComponents, "seatpost");

      if (!frame || !seatpost) return true;

      return frame.standards.seatpost === seatpost.standards.seatpost;
    }
  },
  {
    id: "groupset-speed",
    message: "Las ruedas deben ser compatibles con las velocidades del grupo.",
    validate: (selectedComponents: BikeComponent[]): boolean => {
      const groupset = findCategory(selectedComponents, "groupset");
      const wheels = findCategory(selectedComponents, "wheels");

      if (!groupset || !wheels) return true;

      return Array.isArray(wheels.standards.speeds)
        ? wheels.standards.speeds.includes(groupset.standards.speeds as number)
        : wheels.standards.speeds === groupset.standards.speeds;
    }
  }
];

export function validateBuild(selectedComponents: BikeComponent[]): ValidationResult {
  const issues = rules
    .filter((rule: CompatibilityRule) => !rule.validate(selectedComponents))
    .map((rule: CompatibilityRule) => ({ id: rule.id, message: rule.message }));

  return {
    valid: issues.length === 0,
    issues
  };
}

function findCategory(
  selectedComponents: BikeComponent[],
  category: ComponentCategory
): BikeComponent | undefined {
  return selectedComponents.find((component: BikeComponent) => component.category === category);
}
