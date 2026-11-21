<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A binding's start refused before any grant: another host, another root or folder, or another agent.
 */
final class BindingStartRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notTheHost(string $bindingId): self
    {
        return new self("Only the host of binding {$bindingId} starts its main runtime.");
    }

    public static function notTheRoot(string $bindingId): self
    {
        return new self("Binding {$bindingId} starts only in its own registered folder.");
    }

    public static function incompatible(string $bindingId): self
    {
        return new self(
            "Binding {$bindingId} runs a release this journal cannot speak with: run journal upgrade, or copy a new "
            .'install line, to install a compatible release.',
        );
    }

    public static function notTheMainAgent(string $bindingId): self
    {
        return new self("Binding {$bindingId} starts only its own main agent.");
    }

    public static function environmentUnassigned(string $bindingId): self
    {
        return new self(
            "Binding {$bindingId} works in no environment yet: assign it one of its project's environments in Settings.",
        );
    }

    public static function otherProjectsEnvironment(string $bindingId): self
    {
        return new self("Binding {$bindingId} works only in an environment of its own project.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }

    protected function status(): int
    {
        return 403;
    }
}
