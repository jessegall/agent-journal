<?php

declare(strict_types=1);

namespace App\Commands\Hosts\AllowHostImages;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Models\Projects\Host;
use App\Support\Hosts\HostOrderPlacement;
use App\Values\HostOrderSource;

/**
 * Makes the host's allow_images order, keeps the images it names on the host, and answers the order's id.
 */
final readonly class AllowHostImagesHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(AllowHostImagesCommand $command): string
    {
        $order = $this->placement->forHost(
            $command->hostId,
            HostOrderSource::fromJournal(),
            HostOrderType::AllowImages,
            ['images' => $command->images],
        );

        Host::findLocked($command->hostId)->allowImages($command->images);

        return $order->id;
    }
}
