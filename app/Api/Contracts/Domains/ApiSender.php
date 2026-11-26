<?php

declare(strict_types=1);

namespace App\Api\Contracts\Domains;

use App\Api\Exceptions\ApiFailed;
use App\Contracts\Domains\ApiPayload;
use Spatie\LaravelData\Data;

/**
 * Sends one signed call to the journal and answers its typed answer.
 */
interface ApiSender
{
    /**
     * @template TAnswer of Data
     *
     * @param  ApiPayload<TAnswer>  $call
     * @return TAnswer
     *
     * @throws ApiFailed
     */
    public function send(ApiPayload $call): Data;
}
