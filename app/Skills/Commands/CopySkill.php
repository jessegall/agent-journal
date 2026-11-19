<?php

declare(strict_types=1);

namespace App\Skills\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Skills\Handlers\CopySkillHandler;
use App\Skills\Values\SkillRevisionResult;

/**
 * A user copies a skill they may read, shipped or stored, into a new stored skill under a user- key: the copied text
 * is a snapshot with its source key and digest, never a live include.
 *
 * @implements Command<SkillRevisionResult>
 */
#[HandledBy(CopySkillHandler::class)]
final readonly class CopySkill implements Command
{
    public function __construct(
        public string $sourceKey,
        public string $key,
        public string $requestId,
    ) {}
}
