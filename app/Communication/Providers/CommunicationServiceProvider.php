<?php

declare(strict_types=1);

namespace App\Communication\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Communication\Enums\MessageAbility;
use App\Communication\Links\MessageLinkRecords;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\NumberedTypeRegistry;
use App\Records\Contracts\RecordProviderRegistration;
use Illuminate\Support\ServiceProvider;

/**
 * Core's messaging between actors: the message as a numbered, linkable record.
 */
final class CommunicationServiceProvider extends ServiceProvider
{
    public function boot(
        LinkTypeRegistry $links,
        RecordProviderRegistration $records,
        NumberedTypeRegistry $numbers,
        PolicyCatalogue $policies,
    ): void {
        $policies->register('Core', new PolicyRegistration(Message::class, MessagePolicy::class, MessageAbility::class));
        $links->register([Message::LINK_TYPE => Message::class]);
        $records->register(Message::LINK_TYPE, MessageLinkRecords::class);
        $numbers->register(NumberedModel::global(Message::class));
    }
}
