<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Contracts\AutoAssigner;

/**
 * A domain's declaration of the auto-assigner and the work counter for one of its assignable types.
 */
final readonly class AutoAssignerDefinition
{
    /**
     * @param  class-string<AutoAssigner>  $assignerClass
     * @param  class-string<AssignedWorkProvider>  $workProviderClass
     */
    public function __construct(
        public string $type,
        public string $assignerClass,
        public string $workProviderClass,
    ) {}
}
