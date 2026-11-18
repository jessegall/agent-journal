<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Support;

use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Process\InvokedProcess;

/**
 * The gateway programs this supervisor run started, by the reference its endpoints carry; one started in another run
 * is never adopted, so closing it here does nothing.
 */
#[Singleton]
final class GatewayChildren
{
    /**
     * @var array<string, InvokedProcess>
     */
    private array $children = [];

    public function keep(string $reference, InvokedProcess $child): void
    {
        $this->children[$reference] = $child;
    }

    public function stop(string $reference): void
    {
        $child = $this->children[$reference] ?? null;
        unset($this->children[$reference]);
        $child?->stop();
    }
}
