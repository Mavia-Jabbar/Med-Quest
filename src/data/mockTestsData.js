// High-Fidelity MDCAT Mock Test Questions Database

export const MOCK_TESTS = {
  Biology: {
    id: "bio-1",
    title: "Cell Biology & Genetics",
    description: "Assessment covering cellular organelles, mitosis, meiosis, and Mendelian inheritance patterns.",
    durationMinutes: 30,
    questions: [
      {
        id: "b1",
        text: "Which of the following organelles is exclusively inherited from the maternal gamete?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
        correctAnswer: 2, // Index 2 -> Mitochondria
        explanation: "Mitochondrial DNA (mtDNA) is inherited strictly from the mother because the sperm's mitochondria are typically destroyed after fertilization."
      },
      {
        id: "b2",
        text: "In a typical cell cycle, DNA replication occurs during which specific phase?",
        options: ["G1 Phase", "S Phase", "G2 Phase", "M Phase"],
        correctAnswer: 1,
        explanation: "DNA replication (Synthesis) occurs precisely during the S Phase of Interphase."
      },
      {
        id: "b3",
        text: "What is the primary function of lysosomes within cellular biology?",
        options: ["Lipid synthesis", "ATP production", "Intracellular digestion", "Protein folding"],
        correctAnswer: 2,
        explanation: "Lysosomes contain hydrolytic enzymes necessary for breaking down waste materials and cellular debris."
      },
      {
        id: "b4",
        text: "Which structure represents the physical exchange of genetic material between homologous chromosomes?",
        options: ["Centromere", "Chiasmata", "Kinetochore", "Telomere"],
        correctAnswer: 1,
        explanation: "Chiasmata are the exact points of contact where crossing over occurs during Prophase I of Meiosis."
      },
      {
        id: "b5",
        text: "A person with AB blood type possesses which naturally occurring antibodies in their blood plasma?",
        options: ["Anti-A only", "Anti-B only", "Both Anti-A and Anti-B", "Neither Anti-A nor Anti-B"],
        correctAnswer: 3,
        explanation: "Type AB blood has both A and B antigens on RBCs, meaning they produce zero antibodies against A or B, making them universal recipients."
      }
    ]
  },
  Chemistry: {
    id: "chem-1",
    title: "Organic Chemistry & Thermodynamics",
    description: "Assessment covering nomenclature, reaction mechanisms, enthalpy, and Gibbs free energy.",
    durationMinutes: 30,
    questions: [
      {
        id: "c1",
        text: "Which of the following functional groups possesses the highest priority in IUPAC nomenclature?",
        options: ["Aldehyde", "Ketone", "Carboxylic Acid", "Alcohol"],
        correctAnswer: 2,
        explanation: "According to strict IUPAC rules, Carboxylic Acids (C=O-OH) hold the highest priority suffix."
      },
      {
        id: "c2",
        text: "If a reaction has a negative Enthalpy (ΔH < 0) and a positive Entropy (ΔS > 0), the reaction will be:",
        options: ["Spontaneous at all temperatures", "Non-spontaneous at all temperatures", "Spontaneous only at high temperatures", "Spontaneous only at low temperatures"],
        correctAnswer: 0,
        explanation: "ΔG = ΔH - TΔS. If ΔH is (-) and ΔS is (+), ΔG will ALWAYS be mathematically negative regardless of temperature."
      },
      {
        id: "c3",
        text: "What is the hybridization of the central carbon atom in an Alkyne (Triple Bond)?",
        options: ["sp3", "sp2", "sp", "dsp2"],
        correctAnswer: 2,
        explanation: "Triple bonds involve one sigma bond and two pi bonds, requiring sp hybridization resulting in a linear 180° geometry."
      },
      {
        id: "c4",
        text: "Which principle states that an orbital can hold a maximum of two electrons with opposing spins?",
        options: ["Aufbau Principle", "Hund's Rule", "Heisenberg Uncertainty", "Pauli Exclusion Principle"],
        correctAnswer: 3,
        explanation: "The Pauli Exclusion Principle dictates no two electrons in an atom can have the exact same 4 quantum numbers."
      },
      {
        id: "c5",
        text: "In an SN2 mechanism, the reaction rate depends on:",
        options: ["Substrate only", "Nucleophile only", "Both substrate and nucleophile", "Neither (Zero order)"],
        correctAnswer: 2,
        explanation: "SN2 is a biomolecular nucleophilic substitution; the transition state involves both molecules colliding simultaneously."
      }
    ]
  },
  Physics: {
    id: "phy-1",
    title: "Mechanics & Electromagnetism",
    description: "Assessment covering kinematics, Newton's laws, circuits, and magnetic fields.",
    durationMinutes: 30,
    questions: [
      {
        id: "p1",
        text: "A projectile is launched at an angle of 45°. At its maximum height, what is its vertical velocity?",
        options: ["Maximum", "Zero", "Equal to horizontal velocity", "Terminal velocity"],
        correctAnswer: 1,
        explanation: "At the exact apex of the parabolic arc, the projectile stops moving upward before falling down, meaning Vy = 0."
      },
      {
        id: "p2",
        text: "If the distance between two point charges is doubled, the electrostatic force between them is:",
        options: ["Doubled", "Halved", "Quartered", "Quadrupled"],
        correctAnswer: 2,
        explanation: "Coulomb's Law states F ∝ 1/r². If r becomes 2r, (2r)² = 4r², meaning the force drops by a factor of 4."
      },
      {
        id: "p3",
        text: "What phenomenon occurs when light passes from a less dense medium to a more dense medium?",
        options: ["It bends away from the normal", "It bends toward the normal", "It experiences total internal reflection", "Its frequency decreases"],
        correctAnswer: 1,
        explanation: "According to Snell's Law, transitioning into a higher refractive index causes the wave to slow down and bend toward the normal vector."
      },
      {
        id: "p4",
        text: "Which rule determines the direction of the magnetic field surrounding a current-carrying wire?",
        options: ["Fleming's Left Hand Rule", "Faraday's Law", "Right-Hand Grip Rule", "Lenz's Law"],
        correctAnswer: 2,
        explanation: "The Right-Hand Grip Rule: thumb points in current direction, curling fingers map out the circular B-field vector."
      },
      {
        id: "p5",
        text: "In a completely inelastic collision between two objects, which of the following is conserved?",
        options: ["Kinetic Energy only", "Momentum only", "Both Momentum and Kinetic Energy", "Neither"],
        correctAnswer: 1,
        explanation: "Momentum is always conserved in all isolated collisions, but Kinetic Energy is lost as heat/deformation in inelastic systems."
      }
    ]
  }
};
