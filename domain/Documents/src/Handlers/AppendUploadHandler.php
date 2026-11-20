<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\AppendUpload;
use Domain\Documents\Support\UploadStore;

final readonly class AppendUploadHandler implements CommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(AppendUpload $command): void
    {
        $this->uploads->append($command->uploadId, $command->index, $command->text, $command->digest);
    }
}
