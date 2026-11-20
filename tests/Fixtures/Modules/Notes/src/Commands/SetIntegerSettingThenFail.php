<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Settings\Values\SettingReference;
use Tests\Fixtures\Modules\Notes\Enums\NoteWorkAbility;
use Tests\Fixtures\Modules\Notes\Handlers\SetIntegerSettingThenFailHandler;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * Changes a whole-number setting as a nested command, then fails, so the change rolls back with the outer command.
 *
 * @extends Command<null>
 */
#[HandledBy(SetIntegerSettingThenFailHandler::class)]
#[Authorize(NoteWorkPolicy::class, NoteWorkAbility::Work)]
#[Operation('set_integer_setting_then_fail', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class SetIntegerSettingThenFail extends Command implements AuthorizedCommand
{
    public function __construct(
        public SettingReference $setting,
        public int $value,
        public int $expectedRevision,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return NotePage::class;
    }
}
