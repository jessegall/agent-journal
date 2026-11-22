<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommitUpload;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\UploadStore;

final readonly class CommitUploadHandler extends DocumentCommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(CommitUploadCommand $command): string
    {
        $this->uploads->seal($command->uploadId);

        return $command->uploadId;
    }
}
