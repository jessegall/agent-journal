<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A binding's start refused before any grant: another host, another root or folder, another agent, or a driver
 * the binding may not start.
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

    public static function notReconciled(string $bindingId): self
    {
        return new self(
            "Binding {$bindingId} starts again once its relay has reported what became of its earlier sessions.",
        );
    }

    public static function providerUnavailable(string $bindingId, string $reason): self
    {
        return new self("Binding {$bindingId} cannot start this driver: {$reason}");
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
