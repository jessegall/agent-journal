<?php

declare(strict_types=1);

namespace App\Contracts\Domains;

/**
 * A signed call to the journal, whose answer is TAnswer; its #[Endpoint] says where it goes and what it does.
 *
 * @template-covariant TAnswer of \Spatie\LaravelData\Data
 */
interface JournalCall {}
