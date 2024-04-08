import React, {Component} from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Aktualizuje stan, aby następne renderowanie pokazało zapasowy interfejs użytkownika.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        // Możesz także zalogować błąd do usługi raportowania błędów
        console.error("Wystąpił błąd:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Możesz renderować dowolny zapasowy interfejs użytkownika
            return <h1>Coś poszło nie tak.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
