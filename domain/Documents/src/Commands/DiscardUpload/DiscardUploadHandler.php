<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\DiscardUpload;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\UploadStore;

final readonly class DiscardUploadHandler extends DocumentCommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(DiscardUploadCommand $command): void
    {
        $this->uploads->discard($command->uploadId);
    }
}
