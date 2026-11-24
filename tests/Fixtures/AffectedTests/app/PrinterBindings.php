<?php

declare(strict_types=1);

namespace Fixture;

final class PrinterBindings
{
    public function register(Container $container): void
    {
        $container->bind(Printer::class, InkPrinter::class);
    }
}
