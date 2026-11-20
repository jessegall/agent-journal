<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\DiscardUpload;
use Domain\Documents\Support\UploadStore;

final readonly class DiscardUploadHandler implements CommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(DiscardUpload $command): void
    {
        $this->uploads->discard($command->uploadId);
    }
}
