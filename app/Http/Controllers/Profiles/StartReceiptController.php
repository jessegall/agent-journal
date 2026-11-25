<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Data\Profiles\StartReceiptData;
use App\Data\Profiles\StartReceiptInput;
use App\Http\Loaders\Profiles\StartReceiptLoader;

/**
 * Where a submitted start stands, by the request id in its address; the loader reads it.
 */
final readonly class StartReceiptController
{
    public function __invoke(string $request, StartReceiptLoader $loader): StartReceiptData
    {
        return $loader(StartReceiptInput::from(['request' => $request]));
    }
}
