<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * @extends Command<string>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class SelectMessage extends Command
{
    public function __construct(public string $messageId) {}
}
