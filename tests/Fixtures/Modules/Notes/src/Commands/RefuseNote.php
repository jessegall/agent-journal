<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;

/**
 * @extends Command<int>
 */
#[Authorize(NoteWorkPolicy::class, AccessType::Edit)]
final readonly class RefuseNote extends Command
{
    public function __construct(public string $text) {}
}
