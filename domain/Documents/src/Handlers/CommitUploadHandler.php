<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\CommitUpload;
use Domain\Documents\Support\UploadStore;

final readonly class CommitUploadHandler implements CommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(CommitUpload $command): string
    {
        $this->uploads->seal($command->uploadId);

        return $command->uploadId;
    }
}
