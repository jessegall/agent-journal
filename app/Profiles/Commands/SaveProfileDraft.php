<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Handlers\SaveProfileDraftHandler;
use App\Profiles\Models\Profile;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;

/** @extends Command<int> */
#[HandledBy(SaveProfileDraftHandler::class)]
#[Authorize(ProfileAdministrationPolicy::class, ProfileAbility::EditDraft)]
#[Operation('save_profile_draft', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class SaveProfileDraft extends Command implements AuthorizedCommand
{
    public function __construct(
        public ProfileKey $profile,
        public int $expectedRevision,
        public ScriptSource $source,
    ) {}

    /** @return class-string<Profile> */
    public function subject(): string
    {
        return Profile::class;
    }
}
