<?php

declare(strict_types=1);

namespace App\Ui\Support;

use App\Registries\Support\Registry;
use App\Ui\Contracts\DraftProducer;
use App\Ui\Exceptions\DraftProducerMissing;
use App\Ui\Exceptions\DraftProducerRepeated;
use Illuminate\Container\Container;

/**
 * The draft producer of each noun that offers guided creation, registered at boot. A page offers its guided entry only
 * for a noun that has one, so with none registered no page offers it.
 */
final class DraftProducerRegistry
{
    /**
     * @var Registry<class-string<DraftProducer>>
     */
    private readonly Registry $producers;

    public function __construct()
    {
        $this->producers = Registry::once(DraftProducerMissing::forNoun(...), DraftProducerRepeated::forNoun(...));
    }

    /**
     * @param  class-string<DraftProducer>  $producerClass
     *
     * @throws DraftProducerRepeated
     */
    public function register(string $noun, string $producerClass): void
    {
        $this->producers->put($noun, $producerClass);
    }

    public function offersGuided(string $noun): bool
    {
        return $this->producers->has($noun);
    }

    /**
     * @throws DraftProducerMissing
     */
    public function producerFor(string $noun): DraftProducer
    {
        return Container::getInstance()->make($this->producers->get($noun));
    }
}
