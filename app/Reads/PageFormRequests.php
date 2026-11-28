<?php

declare(strict_types=1);

namespace App\Reads;

use Illuminate\Contracts\Container\Container;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

final readonly class PageFormRequests
{
    public function __construct(private Container $container, private Redirector $redirector) {}

    /**
     * @template TRequest of FormRequest
     * @param class-string<TRequest> $type
     * @return TRequest
     */
    public function from(string $type, Request $visit): FormRequest
    {
        $request = new $type();
        $type::createFrom($visit, $request);
        $request->setContainer($this->container)->setRedirector($this->redirector);
        $request->validateResolved();

        return $request;
    }
}
