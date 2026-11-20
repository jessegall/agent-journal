<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Commands\AppendUpload;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Support\UploadStore;

final readonly class AppendUploadHandler extends DocumentCommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(AppendUpload $command): void
    {
        $this->uploads->append($command->uploadId, $command->index, $command->text, $command->digest);
    }
}
