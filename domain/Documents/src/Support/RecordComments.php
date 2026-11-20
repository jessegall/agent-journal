<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\RequestKey;
use App\Comments\Commands\PostComment;
use App\Records\Support\RecordIdentity;

final readonly class RecordComments
{
    public function __construct(private CommandBus $commands, private RequestKey $key) {}

    /**
     * @param class-string $command
     */
    public function post(RecordIdentity $record, string $body, string $command): string
    {
        return $this->commands->run(new PostComment($record, $body, $this->key->requireFor($command)));
    }
}
