<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Commands\BeginUpload;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Support\UploadStore;

final readonly class BeginUploadHandler extends DocumentCommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(BeginUpload $command): string
    {
        return $this->uploads->begin($command->type, $command->bytes, $command->digest);
    }
}
