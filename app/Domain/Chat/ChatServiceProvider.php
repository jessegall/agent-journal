<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Chat\Models\Message;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Chat's own models.
 */
final class ChatServiceProvider extends ServiceProvider
{
    public function boot(LinkTypes $links): void
    {
        $links->register([
            'chat.message' => Message::class,
        ]);
    }
}
