<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Processes\Values\ProcessGrants;
use App\Profiles\Enums\ProfileType;
use Spatie\LaravelData\Data;

/**
 * One immutable revision of a profile as a launch reads it: its type, instructions, default model, skill lists and
 * launch policy. A null skill allowlist means every applicable skill; an empty one means none.
 */
final class ProfileSnapshot extends Data
{
    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     */
    public function __construct(
        public readonly ProfileKey $key,
        public readonly int $revision,
        public readonly ProfileType $type,
        public readonly string $instructions,
        public readonly string $model,
        public readonly array|null $skillAllowlist,
        public readonly array $requiredSkills,
        public readonly ProfileLaunchPolicy $launch,
        public readonly ProfileAuthorization $authorization,
    ) {}

    /**
     * What this revision lets a launch run, from its access declaration.
     */
    public function processGrants(): ProcessGrants
    {
        return $this->launch->access->processes;
    }
}
