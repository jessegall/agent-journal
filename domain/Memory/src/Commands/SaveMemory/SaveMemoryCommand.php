<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\SaveMemory;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Memory\Models\Memory;
use Domain\Memory\Policies\MemoryPolicy;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Keeps a memory for the calling actor at a weight and answers its id; sent again under the same request key, the
 * bus answers the first id from its receipt.
 *
 * @extends Command<string>
 */
#[Authorize(MemoryPolicy::class, AccessType::Create)]
final readonly class SaveMemoryCommand extends Command
{
    public function __construct(
        #[Required]
        public string $text,
        #[Between(Memory::LIGHTEST, Memory::HEAVIEST)]
        public int $weight,
    ) {}
}
