<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Records\Exceptions\RecordProviderInvalid;

/**
 * Where an owner registers the provider of its records' summaries, once per type, at boot, and where whoever shows
 * records elsewhere, such as a conversation, finds them; with nobody reading them a registration costs nothing.
 */
interface RecordSummaries
{
    /**
     * Registers the summary provider of a record type.
     *
     * @param  string  $provider  a class name, refused unless it is a SummaryProvider
     *
     * @throws RecordProviderInvalid
     */
    public function register(string $type, string $provider): void;

    /**
     * The record types whose summaries are registered.
     *
     * @return list<string>
     */
    public function types(): array;

    /**
     * Whether summaries of records of the type are registered.
     */
    public function covers(string $type): bool;

    /**
     * The summary provider of the type.
     *
     * @throws RecordProviderInvalid
     */
    public function providerOf(string $type): SummaryProvider;
}
