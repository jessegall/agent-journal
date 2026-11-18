<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Skills\Enums\PublicationState;
use RuntimeException;

/**
 * A publication step that cannot go on: a state it may not move to, a worker whose fence is stale, a target the
 * journal does not own, or a path that leaves the protected root.
 */
final class SkillPublicationFailed extends RuntimeException implements CodedRefusal
{
    public static function transition(PublicationState $from, PublicationState $to): self
    {
        return new self("A publication that is {$from->value} cannot become {$to->value}.");
    }

    public static function stale(int $fence, int $current): self
    {
        return new self("This worker holds fence {$fence}, but the publication is at fence {$current}; a newer worker owns it.");
    }

    public static function collision(string $target): self
    {
        return new self("The skill target {$target} holds files the journal did not create; move them before publishing there.");
    }

    public static function escape(string $path): self
    {
        return new self("The path {$path} leaves the protected skills root; nothing was written there.");
    }

    public static function write(string $reason): self
    {
        return new self("The skills could not be written: {$reason}");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
