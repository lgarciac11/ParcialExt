export type Slot = {
    day: number;
    month: number;
    year: number;
    hour: number;
    available: boolean;
    dni?: string;
    doctorId: string;
  };
  
  export type Doctor = {
    name: string;
    lastname: string;
    age: number;
    specialty: string;
  }