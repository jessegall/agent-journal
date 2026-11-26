<?php

declare(strict_types=1);

namespace App\Profiles\Commands\SaveProfileDraft;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileDraftPolicy;
use App\Support\Command;
use App\Values\ProfileKey;
use App\Values\ScriptSource;

/**
 * @extends Command<int>
 */
#[Authorize(ProfileDraftPolicy::class, AccessType::Edit)]
final readonly class SaveProfileDraftCommand extends Command
{
    public function __construct(
        public ProfileKey $profile,
        public int $expectedRevision,
        public ScriptSource $source,
    ) {}
}
