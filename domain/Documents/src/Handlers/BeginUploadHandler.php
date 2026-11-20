<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\BeginUpload;
use Domain\Documents\Support\UploadStore;

final readonly class BeginUploadHandler implements CommandHandler
{
    public function __construct(private UploadStore $uploads) {}

    public function handle(BeginUpload $command): string
    {
        return $this->uploads->begin($command->type, $command->bytes, $command->digest);
    }
}
