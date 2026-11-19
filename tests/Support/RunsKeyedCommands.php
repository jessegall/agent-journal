<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use Illuminate\Support\Str;

/**
 * Runs a command on the bus under a request key of its own, or the given one to send the same request again.
 */
trait RunsKeyedCommands
{
    protected function runOnBus(object $command, string|null $key = null): mixed
    {
        $this->app->make(RequestKey::class)->set($key ?? (string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
