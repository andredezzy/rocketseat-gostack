import { Signal } from '~/repositories/SignalsRepository';

interface Request {
  signals: Signal[];
}

interface Response {
  remaining: number;
  wins: number;
  losses: number;
  assertiveness: number;
}

class BuildSignalsStatisticsService {
  execute({ signals }: Request): Response {
    const remaining = signals.filter(
      signal => !signal.result && signal.date > new Date(),
    ).length;
    const wins = signals.filter(signal => signal.result === 'WIN').length;
    const losses = signals.filter(signal => signal.result === 'LOSS').length;
    const assertiveness = ((wins - losses) / wins) * 100;

    return {
      remaining,
      wins,
      losses,
      assertiveness: assertiveness || 0,
    };
  }
}

export default BuildSignalsStatisticsService;
