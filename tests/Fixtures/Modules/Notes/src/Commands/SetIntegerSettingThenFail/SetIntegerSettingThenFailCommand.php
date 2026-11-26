<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Settings\Values\SettingReference;
use App\Support\Command;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * Changes a whole-number setting as a nested command, then fails, so the change rolls back with the outer command.
 *
 * @extends Command<null>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class SetIntegerSettingThenFailCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public int $value,
        public int $expectedRevision,
    ) {}
}
