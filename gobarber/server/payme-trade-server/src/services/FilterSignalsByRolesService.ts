import { Role } from '@prisma/client';

import { Signal } from '~/repositories/SignalsRepository';

interface Request {
  signals: Signal[];
  roles: Role[];
}

class FilterSignalsByRolesService {
  execute({ signals, roles }: Request): Signal[] {
    return signals.filter(signal =>
      signal.availableFor.length > 0 && !signal.result
        ? roles.some(role => signal.availableFor.includes(role))
        : true,
    );
  }
}

export default FilterSignalsByRolesService;
