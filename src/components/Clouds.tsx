interface CloudsProps {
  className?: string;
  /** inverte verticalmente (nuvem "vista por baixo") */
  flip?: boolean;
}

/**
 * Banco de nuvens — denso e branco, com topo puffy/esfumado e base sólida.
 * Usado na transição "espaço → atmosfera → solo branco" da landing: a sonda
 * mergulha nessa nuvem ao rolar. preserveAspectRatio="none" estica na faixa.
 */
export function Clouds({ className, flip }: CloudsProps) {
  return (
    <svg
      viewBox="0 0 1440 360"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden="true"
    >
      <defs>
        <filter id="cloud-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="80" />
        </filter>
      </defs>
      <g filter="url(#cloud-blur)" fill="#ffffff">
        {/* fileira superior — puffs menores e esparsos (borda esfumada) */}
        <ellipse cx="160" cy="210" rx="150" ry="92" />
        <ellipse cx="430" cy="180" rx="170" ry="104" />
        <ellipse cx="720" cy="195" rx="185" ry="112" />
        <ellipse cx="1010" cy="178" rx="165" ry="102" />
        <ellipse cx="1290" cy="208" rx="155" ry="96" />
        {/* fileira inferior — puffs maiores e densos */}
        <ellipse cx="110" cy="300" rx="200" ry="120" />
        <ellipse cx="350" cy="285" rx="220" ry="130" />
        <ellipse cx="600" cy="305" rx="210" ry="124" />
        <ellipse cx="850" cy="288" rx="230" ry="134" />
        <ellipse cx="1110" cy="300" rx="215" ry="126" />
        <ellipse cx="1360" cy="290" rx="200" ry="122" />
      </g>
    </svg>
  );
}
