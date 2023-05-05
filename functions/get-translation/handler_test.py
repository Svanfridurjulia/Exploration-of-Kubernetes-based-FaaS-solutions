#from . import handler as h
import handler as h

class TestParsing:
    def test_basic_translation(self):
        req = 'hello'
        resp = h.handle(req)
        assert resp == 'hola'

    def test_empty_translation(self):
        req = ''
        resp = h.handle(req)
        assert resp == 'NO QUERY SPECIFIED. EXAMPLE REQUEST: GET?Q=HELLO&LANGPAIR=EN|IT'

    def test_long_translation(self):
        req = "Have you guys heard about function as a service? Apparently its the next big thing. It's going to replace bulky infrastructures with low costing functions that work together!"
        resp = h.handle(req)
        assert resp == '¿Has oído hablar de la función como servicio? Aparentemente es la próxima gran cosa. ¡Va a reemplazar las infraestructuras voluminosas con funciones de bajo coste que funcionan juntas!'

    def test_translation_with_digits(self):
        req = 'I love Go! I could write 10 functions every day'
        resp = h.handle(req)
        assert resp == '¡Me encanta Go! Podría escribir 10 funciones todos los días'