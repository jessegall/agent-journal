<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\BeginUpload;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\UploadStore;

final readonly class BeginUploadHandler extends DocumentCommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(BeginUploadCommand $command): string
    {
        return $this->uploads->begin($command->type, $command->bytes, $command->digest);
    }
}
