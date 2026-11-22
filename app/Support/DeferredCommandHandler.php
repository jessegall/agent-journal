<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\Command;
use Illuminate\Contracts\Container\Container;

/**
 * Builds a command's handler only when the command reaches it, after every middleware let it through, so a refused
 * command never constructs its handler.
 */
final readonly class DeferredCommandHandler
{
    /**
     * @param  class-string  $handler
     */
    public function __construct(private Container $container, private string $handler) {}

    /**
     * @param  Command<mixed>  $command
     */
    public function handle(Command $command): mixed
    {
        $subject = $this->container->make(CommandSubjects::class)->subjectFor($command);

        return $this->container->make($this->handler)->handle($command, ...$subject);
    }
}
