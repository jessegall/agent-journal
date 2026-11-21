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
     * @param  string  $assignerClass  a class name, refused unless it is an AutoAssigner
     * @param  string  $workProviderClass  a class name, refused unless it is an AssignedWorkProvider
     */
    public function __construct(
        public string $type,
        public string $assignerClass,
        public string $workProviderClass,
    ) {}
}
