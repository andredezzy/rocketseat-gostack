import { Signal } from '~/repositories/SignalsRepository';

interface Request {
  originalSignal: Signal;
}

type Response = Omit<Signal, 'won_by' | 'lost_by'> & {
  won_by: string[];
  lost_by: string[];
};

class SerializeSignalService {
  execute({ originalSignal }: Request): Response {
    return {
      ...originalSignal,
      won_by: originalSignal.won_by.map(el => el.id),
      lost_by: originalSignal.lost_by.map(el => el.id),
    };
  }
}

export default SerializeSignalService;
