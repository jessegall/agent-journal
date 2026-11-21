<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Settings\Values\SettingReference;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * Changes a whole-number setting as a nested command, then fails, so the change rolls back with the outer command.
 *
 * @extends Command<null>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class SetIntegerSettingThenFail extends Command
{
    public function __construct(
        public SettingReference $setting,
        public int $value,
        public int $expectedRevision,
    ) {}
}
