<?php

declare(strict_types=1);

namespace App\Profiles\Commands\SaveProfileDraft;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\ProfileDraftPolicy;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;

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
